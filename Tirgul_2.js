//1
db.Vehicles.aggregate(
[
    {
        $unwind: "$treatments"
    },
    {
        $group: {
          _id: "$status",
          total_sales: { $sum: "$treatments.price" }
        }
    },
    {
        $match: {
           total_sales: { $gt: 10000 } 
        }
    },
    {
    $lookup: {
      from: "Vehicles",
      localField: "_id",
      foreignField: "status",
      as: "vehicles"
    }
  },
]);

//2
db.Vehicles.aggregate(
[
    {
        $group: {
          _id: { $year: "$details.production_date" },
          avg_treatments: { $avg: { $size: { $ifNull: ["$treatments", []] }} }
        }
    }
]);

//3
db.Vehicles.aggregate([
    {
        $unwind: "$treatments"
    },
    {
       $match: {
           $expr: { $eq: ["$treatments.type", "החלפת שמן"] }
       }   
    },
    {
        $project: {
            _id: 0,
            treatments: 1
        }
    }
]);

//4
db.Vehicles.aggregate([
  {
    $sort: {
      "details.manufacturer": 1,
      km_driven: -1
    }
  },
  {
    $group: {
      _id: "$details.manufacturer",
      max_vehicle: { $first: "$$ROOT" },
      min_vehicle: { $last: "$$ROOT" }
    }
  },
  {
    $project: {
      _id: 0,
      manufacturer: "$_id",
      max_vehicle: 1,
      min_vehicle: 1
    }
  }
]);

