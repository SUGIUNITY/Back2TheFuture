db.Vehicles.insertMany(
[
  {
    license_number: 1234567,
    details: {
      manufacturer: "Toyota",
      production_date: new ISODate("2012-02-29")
    },
    status: "במשימה",
    location: { type: "Point", coordinates: [34.7818, 32.0853] },
    km_driven: 30000,
    treatments: [
      {
        date: new ISODate("2013-04-28"),
        type: "החלפת שמן",
        price: 2000
      },
      {
        date: new ISODate("2014-01-20"),
        type: "צביעה",
        price: 3000
      }
    ]
  },
  {
    license_number: 1222557,
    details: {
      manufacturer: "Mazda",
      production_date: new ISODate("2011-01-01")
    },
    status: "בתיקון",
    location: { type: "Point", coordinates: [14.1558, 82.1234] },
    km_driven: 10000
  },
  {
    license_number: 7654321,
    details: {
      manufacturer: "Hyundai",
      production_date: new ISODate("2015-06-12")
    },
    status: "מוכן",
    location: { type: "Point", coordinates: [35.2137, 31.7683] },
    km_driven: 25000,
    treatments: [
      {
        date: new ISODate("2020-10-10"),
        type: "בדיקת בלמים",
        price: 1000
      }
    ]
  },
  {
    license_number: 2345678,
    details: {
      manufacturer: "Honda",
      production_date: new ISODate("2014-11-20")
    },
    status: "במשימה",
    location: { type: "Point", coordinates: [33.3128, 44.3615] },
    km_driven: 45000
  },
  {
    license_number: 8765432,
    details: {
      manufacturer: "Ford",
      production_date: new ISODate("2013-09-10")
    },
    status: "בתיקון",
    location: { type: "Point", coordinates: [29.5581, 34.9482] },
    km_driven: 12000,
    treatments: [
      {
        date: new ISODate("2019-12-01"),
        type: "החלפת מצבר",
        price: 850
      }
    ]
  },
  {
    license_number: 1122334,
    details: {
      manufacturer: "Kia",
      production_date: new ISODate("2018-04-15")
    },
    status: "מוכן",
    location: { type: "Point", coordinates: [34.8516, 31.0461] },
    km_driven: 5000
  },
  {
    license_number: 4433221,
    details: {
      manufacturer: "Chevrolet",
      production_date: new ISODate("2017-12-05")
    },
    status: "מוכן",
    location: { type: "Point", coordinates: [35.6895, 33.8938] },
    km_driven: 3000
  },
  {
    license_number: 9988776,
    details: {
      manufacturer: "Subaru",
      production_date: new ISODate("2016-07-18")
    },
    status: "במשימה",
    location: { type: "Point", coordinates: [36.8219, -1.2921] },
    km_driven: 32000,
    treatments: [
      {
        date: new ISODate("2021-02-10"),
        type: "יישור שלדה",
        price: 1200
      },
      {
        date: new ISODate("2022-03-15"),
        type: "החלפת רפידות בלם",
        price: 650
      }
    ]
  },
  {
    license_number: 6677885,
    details: {
      manufacturer: "Volkswagen",
      production_date: new ISODate("2010-03-22")
    },
    status: "בתיקון",
    location: { type: "Point", coordinates: [39.9255, 32.8663] },
    km_driven: 40000
  },
  {
    license_number: 5566778,
    details: {
      manufacturer: "Peugeot",
      production_date: new ISODate("2019-02-28")
    },
    status: "מוכן",
    location: { type: "Point", coordinates: [34.8888, 31.2525] },
    km_driven: 15000,
    treatments: [
      {
        date: new ISODate("2023-01-05"),
        type: "ניקוי פילטר אוויר",
        price: 300
      }
    ]
  }
]
)

db.Vehicles.insertOne(
{
    license_number: 123234,
    details: {
      manufacturer: "Honda",
      production_date: new ISODate("2012-02-29")
    },
    status: "במשימה",
    location: { type: "Point", coordinates: [35.7818, 36.0853] },
    km_driven: 20000,
    treatments: [
      {
        date: new ISODate("2013-04-28"),
        type: "ניקוי כללי",
        price: 2000
      },
      {
        date: new ISODate("2014-01-20"),
        type: "החלפת שמן",
        price: 3000
      }
    ]
  }
)

db.Vehicles.createIndex({ location: "2dsphere" });
db.Vehicles.createIndex({ license_number: 1 }, { unique: true });

