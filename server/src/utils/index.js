const calculateDistance = (riderCoordinates, driverCoordinates) => {
    const R = 6371; // Radius of the Earth in kilometers

    const differenceInLatitude = (riderCoordinates.latitude - driverCoordinates.latitude) * (Math.PI / 180);
    const differenceInLongitude = (riderCoordinates.longitude - driverCoordinates.longitude) * (Math.PI / 180);

    const a = Math.sin(differenceInLatitude / 2) * Math.sin(differenceInLatitude / 2) +
        Math.cos(driverCoordinates.latitude * (Math.PI / 180)) * Math.cos(riderCoordinates.latitude * (Math.PI / 180)) *
        Math.sin(differenceInLongitude / 2) * Math.sin(differenceInLongitude / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}

const calculateMatchPercentage = (riderLocation, driverLocation) => {
    const riderStart = riderLocation.startLocation || { lat: 0, lng: 0 };
    const riderEnd = riderLocation.endLocation || { lat: 0, lng: 0 };
    const driverStart = driverLocation.startLocation || { lat: 0, lng: 0 };
    const driverEnd = driverLocation.endLocation || { lat: 0, lng: 0 };

    const rideStartDistance = calculateDistance(riderStart, driverStart);
    const rideEndDistance = calculateDistance(riderEnd, driverEnd);

    const startMatchPercentage = Math.max(0, 1 - (rideStartDistance / 5)); // Assuming a max distance of 5 km for start location
    const endMatchPercentage = Math.max(0, 1 - (rideEndDistance / 5)); // Assuming a max distance of 5 km for end location

    return Math.round(startMatchPercentage + endMatchPercentage) / 2;
}

module.exports = {
    calculateMatchPercentage,
};