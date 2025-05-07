const Payment = require('../models/Payment');

// Récupérer les statistiques générales des paiements
const getPaymentStats = async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            {
                $facet: {
                    totalAmount: [
                        { $match: { status: 'completed' } },
                        { $group: { _id: null, total: { $sum: '$amount' } } }
                    ],
                    countByStatus: [
                        { $group: { _id: '$status', count: { $sum: 1 } } }
                    ],
                    recentPayments: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        { $project: {
                                orderId: 1,
                                amount: 1,
                                status: 1,
                                paymentMethod: 1,
                                createdAt: 1
                            }}
                    ]
                }
            }
        ]);

        // Formater la réponse
        const totalAmount = stats[0].totalAmount[0]?.total || 0;
        const countByStatus = {};
        stats[0].countByStatus.forEach(item => {
            countByStatus[item._id] = item.count;
        });

        res.status(200).json({
            totalAmount,
            countByStatus,
            recentPayments: stats[0].recentPayments
        });
    } catch (error) {
        console.error('Error getting payment stats:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Récupérer tous les paiements avec pagination
const getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.search) {
            filter.$or = [
                { orderId: { $regex: req.query.search, $options: 'i' } },
                { konnectPaymentId: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const [payments, total] = await Promise.all([
            Payment.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Payment.countDocuments(filter)
        ]);

        res.status(200).json({
            payments,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting all payments:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Récupérer les statistiques par période (jour/semaine/mois)
const getPaymentStatsByPeriod = async (req, res) => {
    try {
        const { period } = req.params; // day, week, month
        let groupBy;

        if (period === 'day') {
            groupBy = {
                $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' }
            };
        } else if (period === 'week') {
            groupBy = {
                year: { $year: '$paymentDate' },
                week: { $week: '$paymentDate' }
            };
        } else if (period === 'month') {
            groupBy = {
                $dateToString: { format: '%Y-%m', date: '$paymentDate' }
            };
        } else {
            return res.status(400).json({ error: 'Invalid period. Use day, week, or month' });
        }

        const stats = await Payment.aggregate([
            {
                $match: {
                    status: 'completed',
                    paymentDate: { $exists: true }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting payment stats by period:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// Récupérer les méthodes de paiement les plus utilisées
const getPaymentMethodStats = async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }},
            { $sort: { count: -1 } }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting payment method stats:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};



// Obtenir un résumé des enregistrements de locataires
const getTenantRegistrationStats = async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            { $match: { tenantRegistrationId: { $exists: true, $ne: null } } },
            { $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }}
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting tenant registration stats:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
// Ajouter cette fonction à src/controllers/adminController.js
const exportPayments = async (req, res) => {
    try {
        const { format, startDate, endDate, status } = req.query;

        // Construire le filtre
        const filter = {};
        if (status) filter.status = status;

        // Filtrer par date si spécifié
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Récupérer les paiements
        const payments = await Payment.find(filter).sort({ createdAt: -1 });

        // Format CSV
        if (format === 'csv') {
            let csv = 'Order ID,Amount,Status,Payment Method,Payment Date,Completion Date,Created At\n';
            payments.forEach(payment => {
                csv += `${payment.orderId},${payment.amount},${payment.status},${payment.paymentMethod},`;
                csv += `${payment.paymentDate ? new Date(payment.paymentDate).toISOString() : ''},`;
                csv += `${payment.completionDate ? new Date(payment.completionDate).toISOString() : ''},`;
                csv += `${new Date(payment.createdAt).toISOString()}\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=payments_export.csv');
            return res.send(csv);
        }

        // Format par défaut: JSON
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error exporting payments:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

// N'oubliez pas d'ajouter la fonction à l'export du module
module.exports = {
    getPaymentStats,
    getAllPayments,
    getPaymentStatsByPeriod,
    getPaymentMethodStats,
    getTenantRegistrationStats,
    exportPayments
};