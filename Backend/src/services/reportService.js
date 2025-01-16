const PdfKit = require('pdfkit');
const { Parser } = require('json2csv');

// Helper function to calculate distance between two coordinates in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

// shaper office location coordinates  -26.186049224968382, 28.018738438626944
const officeLat = -26.186049224968382; 
const officeLon = 28.018738438626944; 

const generatePDF = (data, res, reportType) => {
    const doc = new PdfKit();
    console.log("report typpppeee", reportType);
    const typeOfReport = reportType === 'daily' ? 'Daily ' : reportType === 'weekly' ? 'Weekly ' : 'Monthly '; 
    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance-report.pdf"');

    // Pipe PDF stream directly to response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(16).text(`${typeOfReport} 'Learner Attendance Report', { align: 'center' }`);
    doc.moveDown();

    data.forEach((record) => {
        const location = JSON.parse(record.geolocation);
        const distance = calculateDistance(location.latitude, location.longitude, officeLat, officeLon);
        const onSite = distance <= 120 ? 'Onsite - Shaper Office' : 'Remote';

        doc.fontSize(12).text(`Learner Name: ${record.learner.name}`);
        doc.text(`Learner ID: ${record.learner.id}`);
        doc.text(`Employee Number: ${record.learner.employeeNumber}`);
        doc.text(`Check-in Date: ${new Date(record.checkinAt).toLocaleDateString()}`);
        doc.text(`Check-in Time: ${new Date(record.checkinAt).toLocaleTimeString()}`);
        doc.text(`Location: ${record.geolocation}`);
        doc.text(`On Site: ${onSite}`);
        
        // Determine if checked in late
        const checkinTime = new Date(record.checkinAt).toLocaleTimeString();
        const isLate = checkinTime > '08:00:00 AM' ? 'YES' : 'NO';
        doc.text(`Checked In Late: ${isLate}`);
        
        doc.moveDown();
    });

    // Finalize the PDF and send
    doc.end();
};

const generateCSV = (data, reportType) => {
    // Define the desired fields for the CSV
    const fields = [
        { label: 'Learner ID', value: 'learner.id'},
        { label: 'Learner Name', value: 'learner.name' },
        { label: 'Employee Number', value: 'learner.employeeNumber' },
        { label: 'Checked In Date', value: (row) => new Date(row.checkinAt).toLocaleDateString() },
        { label: 'Checked In Time', value: (row) => new Date(row.checkinAt).toLocaleTimeString() },
        { label: 'Check In Location', value: (row) => {
            const location = JSON.parse(row.geolocation);
            return `Lat: ${location.latitude}, Long: ${location.longitude}`;
        }},
        { label: 'Location', value: (row) => {
            const location = JSON.parse(row.geolocation);
            const distance = calculateDistance(location.latitude, location.longitude, officeLat, officeLon);
            return distance <= 120 ? 'On Site - Shaper Office' : 'Remote';
        }},
        { label: 'Checked In Late', value: (row) => {
            const checkinTime = new Date(row.checkinAt).toLocaleTimeString();
            return checkinTime > '08:00:00 AM' ? 'YES' : 'NO';
        }},
    ];

    // Add a title at the top
    const typeOfReport = reportType === 'daily' ? 'Daily' : reportType === 'weekly' ? 'Weekly' : 'Monthly'; 
    const title = `${typeOfReport} Learner Attendance Report\n\n`;
    const parser = new Parser({ fields });
    const csvData = parser.parse(data);

    // Return the formatted CSV with the title
    return `${title}${csvData}`;
};

module.exports = { generatePDF, generateCSV };