class APIFeature{
  constructor(query,queryString){
    this.query=query;
    this.queryString=queryString
  }

  //basic filtering
  filter(){
    const queryObject = {...this.queryString}; //using this syntax we make a shallow copy of object ie. copy all the properties in this object 
    //const queryObject = req.query;  // queryObject work as pointer and it would make another copy
    const excludeFeilds = ['page', 'sort', 'limit', 'feilds' ];
    excludeFeilds.forEach((el) => delete queryObject[el]);

    //Advance filtering for applyin feature like gte,lte
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //find return query
     this.query.find(JSON.parse(queryStr));

     return this;
  }

  sort(){
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);

    }else{
      this.query = this.query.sort('-createdBy')
    } 
    return this;
  }
  limitFeilds(){
        if(this.queryString.feilds){
     const feild = this.queryString.feilds.split(',').join(' ');
     //selecting particular feild through select is known as projection
     this.query = this.query.select(feild)

    }else{
      this.query = this.query.select('-__v')
    }
    return this;
  }



}
module.exports = APIFeature;