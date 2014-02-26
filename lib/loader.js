var end_of_time = new Date(2013,0,1); 
// This is a driver program that loads data using the methods implemented 
// in the student's "time-series.js" file. 

load("time-series.js");

// we expect that file to define Classes for each implementation 

var dps = new DocumentPerSample();
var dph = new DocumentPerHour();
var dpd = new DocumentPerDay(); 

// we expect that the caller told us how many server to simulate 

print("Simulating " + serverCount + " servers at " + new Date());

// and how big a time period we should load data for 

print("Generating " + monthCount + " months of samples");
var begin = new Date( end_of_time );
begin.setMonth(begin.getMonth() - monthCount); 

// and which model to use 
print("With the " + impl + " implementation");
var engine = null; 
if(impl=="sample") engine = dps;
if(impl=="hour") engine = dph;
if(impl=="day") engine = dpd;
// we sit in a loop, advancing time in 5 minute intervals

for( var clock=begin; clock<=end_of_time; clock.setUTCMinutes( clock.getUTCMinutes() + 5)) {
    // during each 5 minute window, each server generates a sample 
    for( var server=0; server<serverCount; server++ ) { 
     //   printjson(server);
	//printjson(clock);
	engine.store( 'server'+server, Random.randInt(100), new Date( clock ) );
    }
}

