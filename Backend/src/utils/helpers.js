const getTimeRange = (reportType) => {
    const today = new Date();
    let start, end;

    switch (reportType) {
        case 'daily':
            start = new Date(today.setHours(0, 0, 0, 0));
            end = new Date(today.setHours(23, 59, 59, 999));
            break;
        case 'weekly':
            const firstDayOfWeek = today.getDate() - today.getDay();
            start = new Date(today.setDate(firstDayOfWeek));
            end = new Date(today.setDate(firstDayOfWeek + 6));
            break;
        case 'monthly':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
    }

    return { start, end };
};

module.exports = { getTimeRange };
