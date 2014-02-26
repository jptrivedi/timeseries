
//-----------------------------------------------------------------------------
// Document per sample (dps)  
//

function DocumentPerSample() { 

    this.store = function( server_name, cpu_measurement, timestamp ) { 
        // implement the mongodb method to store a sample
	db.sample.insert({"server_name": server_name, "cpu_measurement": cpu_measurement, "timestamp": timestamp}); 
    };

    this.query = function( server_name, start, end ) {
        // query the set of documents for that server over the specified 
        // time range. don't worry about aggregating the data, just return 
        // all of the docs that you need for the answer 
        // remember to actually drain the cursor! (hint: "itcount()")
	start_date = new Date(start);
	end_date = new Date(end);
	printjson(start_date);
	printjson(end_date);
	var cursor = db.sample.find({"server_name": server_name, "timestamp": {$gte: start_date, $lte: end_date}});
	var cnt = cursor.itcount();
    //	while (cursor.hasNext()) {
//		printjson(cursor.next());
//	}

};
}


//-----------------------------------------------------------------------------
// Document per hour (dph)
//

function DocumentPerHour() { 

    this.store = function( server_name, cpu_measurement, timestamp ) { 
        // implement the mongodb method to store a sample
	var date = new Date(timestamp);
	var hour_for_date = date.getHours();
	var set_hour_for_date = date.setHours(hour_for_date,0,0,0);
	var final_date = new Date(set_hour_for_date);
	//printjson(date);
	//printjson(date.getHours());
	var load = cpu_measurement;
	db.hourly_sample.update({"hour": final_date, "server_name": server_name},{$inc: {"count": 1, "cpu_measurement": load}},{upsert: true});	
    };

    this.query = function( server_name, start, end ) {
        // query the set of documents for that server over the specified 
        // time range. don't worry about aggregating the data, just return 
        // all of the docs that you need for the answer 
        // remember to actually drain the cursor! (hint: "itcount()")
	start_date = new Date(start);
	var hour_for_start_date = start_date.getHours();
	var set_hour_for_start_date = start_date.setHours(hour_for_start_date,0,0,0);
	var final_start_date = new Date(set_hour_for_start_date);
        end_date = new Date(end);
	var hour_for_end_date = end_date.getHours();
        var set_hour_for_end_date = end_date.setHours(hour_for_end_date,0,0,0);
        var final_end_date = new Date(set_hour_for_end_date);
        var cnt = db.hourly_sample.find({"server_name": server_name, "hour": {$gte: final_start_date, $lte: final_end_date}}).itcount();    
};
}

//-----------------------------------------------------------------------------
// Document per day (dpd)
//

function DocumentPerDay() { 

    this.store = function( server_name, cpu_measurement, timestamp ) { 
        // implement the mongodb method to store a sample
	var date = new Date(timestamp);
	var hour_for_date = date.getHours().toString();
	
	date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

	var cpu_data = "hours." + hour_for_date + ".cpu_measurement";
	var total_data = "hours." + hour_for_date + ".total";

	var load_data = {};
	load_data[cpu_data] = cpu_measurement;
	load_data[total_data] = 1;

	db.daily_sample.update({"server_name": server_name,"day": date}, {$inc : load_data}, {upsert:true});
    };

    this.query = function( server_name, start, end ) {
        // query the set of documents for that server over the specified 
        // time range. don't worry about aggregating the data, just return 
        // all of the docs that you need for the answer 
        // remember to actually drain the cursor! (hint: "itcount()")
	var start_date = new Date(start);
        var hour_for_start_date = start_date.getHours().toString();

        start_date.setHours(hour_for_start_date);
        start_date.setMinutes(0);
        start_date.setSeconds(0);
        start_date.setMilliseconds(0);

        var end_date = new Date(end);
	var hour_for_end_date = end_date.getHours().toString();

 	end_date.setHours(hour_for_end_date);
	end_date.setMinutes(0);
	end_date.setSeconds(0);
	end_date.setMilliseconds(0);

        var cursor = db.daily_sample.find({"server_name": server_name,"day": {$gte: start_date, $lte: end_date}});
    	var cnt = cursor.itcount();
};
}
