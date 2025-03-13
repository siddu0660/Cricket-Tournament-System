function addVenue(data) {
  return new Promise((resolve, reject) => {
    const sql = `
            INSERT INTO Venue 
            (venueName, capacity, venueLocation, surfaceType, country)
            VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
      data.venueName,
      data.capacity,
      data.venueLocation,
      data.surfaceType,
      data.country,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getVenueById(venueId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Venue WHERE venueId = ?";
    db.query(sql, [venueId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function updateVenue(venueId, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length === 0) {
      return reject(new Error("No fields to update"));
    }

    let fields = [];
    let values = [];

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    values.push(venueId);

    const sql = `UPDATE Venue SET ${fields.join(", ")} WHERE venueId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteVenue(venueId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Venue WHERE venueId = ?";
    db.query(sql, [venueId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getAllVenues() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Venue";
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function checkVenueAvailability(venueId, date) {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT COUNT(*) as matchCount 
            FROM Matches 
            WHERE venueId = ? AND matchDate = ?
        `;

    db.query(sql, [venueId, date], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].matchCount === 0);
      }
    });
  });
}
