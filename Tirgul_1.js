//1
db.Vehicles.findOne({license_number: 1222557});

//2
db.Vehicles.find({status: "במשימה"}, { license_number: 1, location: 1, _id: 0 });

//3
db.Vehicles.find({status: { $ne: "במשימה" }}, { license_number: 1, production_date: "$details.production_date", _id: 0 });

//4
db.Vehicles.find({}).sort({"details.production_date": -1}).limit(3);

//5
db.Vehicles.aggregate(
[
{
   $sort: {"details.production_date": -1}
},
{
        $limit: 3
}
]
);

//6
db.Vehicles.find({"details.production_date": {$gt: ISODate("2010-01-01")}});

//7
db.Vehicles.aggregate([
  {
    $match: {
      $expr: {
        $or: [{$eq: [{ "$month": {$toDate: "$details.production_date"} }, 7 ]}, {$eq: [{ "$month": {$toDate: "$details.production_date"} }, 8 ]}]
      }
    }
  },
  {
      $project: {
        _id: 0 ,
        license_number: 1, 
        production_date_year: {$year: "$details.production_date"}
    }
  }
]);

//8
db.Vehicles.find(
   { 
       location : { 
       $near :
          {
            $geometry: { type: "Point",  coordinates: [ 34.8, 32.1 ] },
            $maxDistance: 50000
          }
       } 
   }
);

//OR

db.Vehicles.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [34.8, 32.1] },
      distanceField: "distance",
      maxDistance: 50000,
      spherical: true,
      key: "location"
    }
  }
]);

//9
db.Vehicles.find( 
 {
   location : {
      $geoWithin : {
         $geometry : {
            type : "Polygon",
            coordinates : [[
            [29.5, 30.8],   
            [40.0, 30.8],   
            [40.0, 33.5],  
            [29.5, 33.5],   
            [29.5, 30.8]    
          ]]
         }
       }
    }
  } 
);
//10
db.Vehicles.find({treatments: { $exists: true }});
//OR
db.Vehicles.find({$and: [ {treatments: { $exists: true }}, {$expr: { $gte: [{ $size: "$treatments" }, 1] }}]});

//11
db.Vehicles.find({$and: [ {treatments: { $exists: true }}, {$expr: { $gt: [{ $size: "$treatments" }, 3] }}]});

//12
db.Vehicles.find({$and: [ {treatments: { $exists: true }}, {"treatments.type": { $in: ["החלפת שמן"] }}]});
//OR
db.Vehicles.find({$and: [ {treatments: { $exists: true }}, {
  treatments: {
    $elemMatch: {
      type: "החלפת שמן",
    }
  }
}]});

//Update

//1
db.Vehicles.updateMany({}, {$set:{"fuel": 60}});

//2
db.Vehicles.updateMany({status: "במשימה"}, {$set:{"fuel": 35}});

//3
db.Vehicles.updateMany({}, 
[
    {
        $set:{"fuel": {$min: [{$add : ["$fuel", 20]}, 60]}}
    }
]);

//4
    db.Vehicles.updateMany(
       {},
       {
          $rename: { "fuel": "fuel_percentage" }
       }
    );
    
    db.Vehicles.updateMany({}, 
             [
                 {
                     $set:{"fuel_percentage": {$multiply: ["$fuel_percentage", 1.666]}}
                 }
             ] 
    );
    
    //OR
    
    db.Vehicles.updateMany(
  { fuel: { $exists: true } },
  [
    {
      $set: {
        fuel_percentage: { $multiply: ["$fuel", 1.666] }
      }
    },
    {
      $unset: "fuel"
    }
  ]
);
    

//5
db.Vehicles.updateMany({status: "בתיקון"}, 
   {$push: {treatments: { $each: [
        {
            type: "החלפת ברקסים",
        },
        {
            type: "החלפת צמיגים",
        }
      ] 
     }
    }
   }
)


//6
db.Vehicles.updateMany({},
{
    $pop: {treatments: -1}
});

db.Vehicles.updateMany(
  { treatments: { $exists: true, $ne: [] } }, // vehicles with non-empty treatments
  [
    {
      $set: {
        treatments: {
          $let: {
            vars: {
              sorted: {
                $sortArray: {
                  input: "$treatments",
                  sortBy: { date: 1 }  // sort ascending, oldest first
                }
              }
            },
            in: {
              $slice: ["$$sorted", 1, { $size: "$$sorted" }] // skip oldest, keep rest
            }
          }
        }
      }
    }
  ]
);


//7
db.Vehicles.updateMany(
  { treatments: { $exists: true } },
  [
    {
      $set: {
        treatments: {
          $sortArray: {
            input: "$treatments",
            sortBy: { price: -1 }
          }
        }
      }
    }
  ]
);

//8
db.Vehicles.updateOne(
  {license_number: 123299},
  { $set: { "details.production_date": new Date(),
   "details.manufacturer": "BMW",
   status: "במשימה",
   location: { type: "Point", coordinates: [39, 40],
   },
   fuel_percentage: 99.96,
   km_driven: 10000}  }, 
  { upsert: true } 
);