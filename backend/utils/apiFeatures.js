// const { forEach } = require("lodash");

class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options: "i"
            },
        }
        :{};

        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }
    
    filter(){
        const queryStrCopy = {...this.queryStr};
        // console.log(queryStrCopy);
        // Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key)=> delete queryStrCopy[key]);
        // console.log(queryStrCopy);

        // Filter for Price and Rating

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=> `$${key}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryStr);
        // console.log(this.query._conditions);
        return this;



    }
}

module.exports = ApiFeatures;