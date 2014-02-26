Time Series Lab
===============

Your job is to implement 3 different models for storing time-series data, 
design a mongodb server configuration to handle these workloads, and then 
evaluate the performance of your workloads on that server. 

The Scenario 
------------

You're building a software system that's going to keep track of servers in a 
data center. You need to be able to track the cpu load of all of the servers 
in your data center so you can quickly find a server that's maxed out. Your 
task is to design the mongodb schema and transactions that will support the 
collection and reporting of this data. You are also responsible for sizing 
the database server that will hold this data, and be able to say with 
confidence that it can support the full load of the application. 

Use Cases 
---------

### Storing a sample S from server X at time T 

Your application needs to take a server-name, cpu-load measurement, and 
a timestamp, and store it in MongoDB. 

### Find the hourly average cpu for server X over the last D days 

Your application needs to accept a query for a server-name, and a time range, 
and then return the hourly average cpu load for that machine. 

Implementation Choices
----------------------

### Document per sample 

This is the "relational database" way of modeling the application. As samples 
arrive, you store each one as a document in the database.  

    { load: 92, server: 'server1', timestamp: ISODate("...") } 

As samples arrive, you just insert them into the database. When a query arrives
we'll fetch all of the documents in that time range and return them. 

### Document per hour 

Another option is to store 1 document for each hour and to pre-aggregate 
new samples into that document. Here you'd keep a sum and an average and 
increment them when new samples arrive: 

    { load_sum: 1231, load_count: 100, server: 'server1', hour: ISODate("...") }

When samples arrive, you do an update on this document to increment the sum
and count for the proper hour. In this case, the timestamp would be truncated
to the hour in which the sample happened. 

### Document per day 

We could group all of the load averages for a single day into a single document.
This is a lot like the document per hour scenario, except we store an array
of "hour average" sub-documents within a larger document. 

    { 
        server: 'server1',
        day: ISODate("..."),
        hours: {
            0: { sum: 1231, count: 100 },
            1: { sum: 732,  count: 25  },
            2: { sum: 342,  count: 30  },
            ...
        }
    } 

When samples arrive, we insert them into the proper hour of the day document.

Exercises 
---------

1. Implement each design choice method
  (open the time-series.js file and fill in your code) 
  (use a local mongodb instance to test it)
  - what is the mongodb command to store the document? 
  - what is the mongodb query to find results? 
  - what index would you use for this 
  - what shard key would you use for this 
  -- what could you use as a right-balanced shard key? 
  - how could you use the aggregation framework to roll up results? 

2. Given a budget of $650 / month, design a server to run this workload 
  (launch and configure your instance in 10gen's aws-test account) 
  (configure & tune the system to your liking, but document what you changed)
  - which instance size would you choose? 
  - what drive configuration would you choose? 
  - what read-ahead setting would you use? 

3. Measure the design choices on your server 
  (launch an instance of ami-XXXXXX to serve as your test driver)
  (install your implementation file on that machine & use it to test) 
  (save your results directory from the test server when you're done) 
  - what insert rate can you achieve? 
  - what query rate can you achieve for a 0-30 day time ranges? 

  
Instructions
============

*Run the loader* 

    ./bin/load <serverCount> <monthCount> <sample|hour|day> <hostname>

for example: 

    ./bin/load 10000 12 sample localhost:27017

*Run the reader* 

    ./bin/reader <serverCount> <dayCount> <sample|hour|day> <concurrency> <time> <hostname>

for example: 

    ./bin/reader 10000 30 sample 10 10 localhost:27017
