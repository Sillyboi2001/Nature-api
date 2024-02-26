import { Query } from 'mongoose';

class ApiFeatures {
  public query: Query<any[], any>;
  public queryString: any;

  constructor(query: Query<any[], any>, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }
  filter(): ApiFeatures {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Adv filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort(): ApiFeatures {
    if (typeof this.query.sort === 'string') {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  fieldLimits(): ApiFeatures {
    if (typeof this.queryString.fields === 'string') {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination(): ApiFeatures {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export default ApiFeatures;
