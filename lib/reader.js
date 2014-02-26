var end_of_time = new Date(2013,0,1); 
// This is a driver program that loads data using the methods implemented 
// in the student's "time-series.js" file. 

load("time-series.js");

// we expect that file to define Classes for each implementation 

var dps = new DocumentPerSample();
var dph = new DocumentPerHour();
var dpd = new DocumentPerDay(); 

// we expect that the caller told us how many servers to simulate 

print("Querying " + serverCount + " servers at " + new Date());

// and how big a time period we should query data for 

print("Loading the last " + dayCount + " days of samples");
var begin_range = new Date( end_of_time );
begin_range.setDate( begin_range.getDate() - dayCount );

// and which model to use 
print("With the " + impl + " implementation");
var engine = null; 
if(impl=="sample") engine = dps;
if(impl=="hour") engine = dph;
if(impl=="day") engine = dpd;

for(;;) { 
    var name = "server" + Random.randInt(serverCount);
    engine.query( name, begin_range, end_of_time );  
}
