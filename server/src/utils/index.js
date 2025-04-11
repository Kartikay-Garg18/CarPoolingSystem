const calculateMatchPercentage = (riderLocation, driverLocation) => {
    const riderStart = riderLocation.startLocation || { lat: 0, lng: 0 };
    const riderEnd = riderLocation.endLocation || { lat: 0, lng: 0 };
    const driverStart = driverLocation.startLocation || { lat: 0, lng: 0 };
    const driverEnd = driverLocation.endLocation || { lat: 0, lng: 0 };

    const riderRoute = [riderStart, riderEnd];
    const driverRoute = [driverStart, driverEnd];

    let matchCount = 0;
    let totalCount = 0;

    for (let i = 0; i < riderRoute.length; i++) {
        for (let j = 0; j < driverRoute.length; j++) {
            if (riderRoute[i].lat === driverRoute[j].lat && riderRoute[i].lng === driverRoute[j].lng) {
                matchCount++;
            }
            totalCount++;
        }
    }

    return matchCount / totalCount;
}

module.exports = {
    calculateMatchPercentage,
};