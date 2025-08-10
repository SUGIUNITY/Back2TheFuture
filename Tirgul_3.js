const mapFunction = function () {
    if (!this.treatments) return;
    
   this.treatments.forEach(treatment => {
       if (treatment && treatment.type != null) {
           if (treatment.price == null) {
               treatment.price = 0;
           }
           
          emit(treatment.type, treatment.price);
       }
  });
};

const reduceFunction = function (key, values) {
  return {
    sum: Array.sum(values),
    count: values.length
  };
};

const finalizeFunction = function (key, reducedValue) {
  return {
    avg_price: reducedValue.sum / reducedValue.count,
    treatments_count: reducedValue.count
  };
};

db.Vehicles.mapReduce(
  mapFunction,
  reduceFunction,
  {
    out: "avg_prices_by_type",
    finalize: finalizeFunction
  }
);

db.avg_prices_by_type.find({});
