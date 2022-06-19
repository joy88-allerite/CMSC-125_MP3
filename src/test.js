const timer = ms => new Promise(res => setTimeout(res, ms))
/*
    Jobs:
        - time: time to complete job
        - size: size of job
*/
const jobs = [
    {processing: false, waiting: 0,  time: 5,   size: 5760},    // 0
    {processing: false, waiting: 0,  time: 4,   size: 4190},    // 1
    {processing: false, waiting: 0,  time: 8,   size: 3290},    // 2
    {processing: false, waiting: 0,  time: 2,   size: 2030},    // 3
    {processing: false, waiting: 0,  time: 2,   size: 2550},    // 4
    {processing: false, waiting: 0,  time: 6,   size: 6990},    // 5
    {processing: false, waiting: 0,  time: 8,   size: 8940},    // 6
    {processing: false, waiting: 0,  time: 10,  size: 740},     // 7
    {processing: false, waiting: 0,  time: 7,   size: 3930},    // 8
    {processing: false, waiting: 0,  time: 6,   size: 6890},    // 9
    {processing: false, waiting: 0,  time: 5,   size: 6580},    // 10
    {processing: false, waiting: 0,  time: 8,   size: 3820},    // 11
    {processing: false, waiting: 0,  time: 9,   size: 9140},    // 12
    {processing: false, waiting: 0,  time: 10,  size: 420},     // 13
    {processing: false, waiting: 0,  time: 10,  size: 220},     // 14
    {processing: false, waiting: 0,  time: 7,   size: 7540},    // 15
    {processing: false, waiting: 0,  time: 3,   size: 3210},    // 16
    {processing: false, waiting: 0,  time: 1,   size: 1380},    // 17
    {processing: false, waiting: 0,  time: 9,   size: 9850},    // 18
    {processing: false, waiting: 0,  time: 3,   size: 3610},    // 19
    {processing: false, waiting: 0,  time: 7,   size: 7540},    // 20
    {processing: false, waiting: 0,  time: 2,   size: 2710},    // 21
    {processing: false, waiting: 0,  time: 8,   size: 8390},    // 22
    {processing: false, waiting: 0,  time: 5,   size: 5950},    // 23
    {processing: false, waiting: 0,  time: 10,  size: 760}      // 24
];

/*
    Memory:
        - occupied: The index of the job that occupies the memory
        - size: The size of the memory block
*/
const memory = [
    {occupied: -1, size: 9500},
    {occupied: -1, size: 7000},
    {occupied: -1, size: 4500},
    {occupied: -1, size: 8500},
    {occupied: -1, size: 3000},
    {occupied: -1, size: 9000},
    {occupied: -1, size: 1000},
    {occupied: -1, size: 5500},
    {occupied: -1, size: 1500},
    {occupied: -1, size: 500},
];

class Scheduling {
    constructor(jobs, memory, type) {
        this.type = type;
        this.throughput = 0;
        this.storageUtil = 0;
        this.totalWaitingTime = 0;
        this.interalFramentation = 0;

        // Doing this iteration to remove the reference from objects

        this.jobs = [];
        for (let i = 0; i < jobs.length; i++) {
            this.jobs.push(Object.assign({}, jobs[i]));
        }

        this.memory = [];
        for (let i = 0; i < memory.length; i++) {
            this.memory.push(Object.assign({}, memory[i]));
        }
    }

    simulate = () => {
        $('#simBody').html('');
        let finished = false;

        let jobs = [];
        for (let i = 0; i < this.jobs.length; i++) {
            jobs.push(Object.assign({}, this.jobs[i]));
        }

        let memory = [];
        for (let i = 0; i < this.memory.length; i++) {
            memory.push(Object.assign({}, this.memory[i]));
        }

        let time = 0;
        let internalFrag = 0;
        let totalCurrFrag = 0;
        let totalFrag = 0;
        let totalMemoryUsage = 0;
        let totalProcessingJobs = 0;

        while(!finished) {
            finished = true;
            // console.log(`Time: ${time}`);
            totalCurrFrag = 0;
            for (let i = 0; i < jobs.length; i++) {

                // Check if job can be added to memory
                for (let j = 0; j < memory.length; j++) {
                    internalFrag = 0;
                    if (jobs[i].time == 0) {
                        continue;
                    }

                    if 
                    (
                        memory[j].occupied == i || 
                        (
                        memory[j].occupied == -1 && 
                        jobs[i].processing == false &&
                        jobs[i].size <= memory[j].size
                        )
                    ) {
                        
                        jobs[i].time--;
                        
                        // console.log(`Job ${i} added to memory ${j}`);
                        $('#simBody').append(`<tr>
                            <th class="text-center">${time + 1}</th>
                            <th colspan="4">Job ${i + 1} added to memory ${j + 1}</th>
                        </tr>`
                        );
                        // get the internal frag
                        internalFrag = memory[j].size - jobs[i].size;

                        if (jobs[i].time == 0) {
                            memory[j].occupied = -1;
                            jobs[i].processing = false;
                            // console.log(`Job ${i} finished`);
                        } else {
                            memory[j].occupied = i;
                            finished = false;
                            jobs[i].processing = true;
                        }
                    }
                    totalCurrFrag += internalFrag;
                }

                if (jobs[i].time != 0 && jobs[i].processing == false ) {
                    jobs[i].waiting++;
                }
            }

            time++;

            // count the memory that is occupied
            let occupied = 0;

            for (let j = 0; j < memory.length; j++) {
                if (memory[j].occupied != -1) {
                    occupied++;
                }
            }

            totalMemoryUsage += (occupied / memory.length) * 100;

            // count the number of jobs that are being processed
            let processing = 0;
            for (let i = 0; i < jobs.length; i++) {
                if (jobs[i].processing == true) {
                    processing++;
                }
            }

            totalProcessingJobs += processing;


            totalFrag += totalCurrFrag;
            if (time == 1000) {
                finished = true;
            }
        }

        console.log("---------------------------------");
        this.throughput = (totalProcessingJobs / time).toFixed(2);
        console.log(`Throughput: ${this.throughput} jobs/s`);
        this.storageUtil = (totalMemoryUsage/time).toFixed(2);
        console.log(`Storage Utilization: ${(totalMemoryUsage/time).toFixed(2)}%`);
        this.totalWaitingTime = time;
        console.log(`Total Time: ${this.totalWaitingTime}`);

        // get average waiting time
        let totalWaiting = 0;
        for (let i = 0; i < jobs.length; i++) {
            totalWaiting += jobs[i].waiting;
        }
        
        console.log(`Average Waiting Time: ${(totalWaiting/jobs.length).toFixed(2)}`);
        this.interalFramentation = (totalFrag / time).toFixed(2);
        console.log(`Average Internal Fragmentation: ${this.interalFramentation}`);
        
        let content = `<tr>
        <th>${(totalProcessingJobs/time).toFixed(2)} jobs/s</th>
        <th>${(totalMemoryUsage/time).toFixed(2)}%</th>
        <th>${time}</th>
        <th>${(totalWaiting/jobs.length).toFixed(2)}</th>
        <th>${(totalFrag/time).toFixed(0)}</th>
        </tr>`;

        $(`#${this.type}`).html(content);
    }

    construct = () => {
        let content = '';

        for (let i = 0; i < this.jobs.length; i++) {
            content += `<tr>
                <th>${i + 1}</th>
                <th>${this.jobs[i].time}</th>
                <th>${this.jobs[i].size}</th>
                </tr>`;
        }
        
        $('#jobs').html(content);

        content = '';

        for (let i = 0; i < this.memory.length; i++) {
            content += `<tr>
                <th>${i + 1}</th>
                <th>${this.memory[i].size}</th>
                </tr>`;
        }
        
        $('#memory').html(content);
    }
}

class FirstFit extends Scheduling {
    constructor(jobs, memory) {
        super(jobs, memory, 'FirstFit');
    }
}


class WorstFit extends Scheduling {
    constructor(jobs, memory) {
        super(jobs, memory, 'WorstFit');
        this.memory.sort((a, b) => {
            return b.size - a.size;
        });
    }
}

class BestFit extends Scheduling {
    constructor(jobs, memory) {
        super(jobs, memory, 'BestFit');
        this.memory.sort((a, b) => {
            return a.size - b.size;
        });
    }
}

const firstFit = new FirstFit(jobs, memory);
const worstFit = new WorstFit(jobs, memory);
const bestFit = new BestFit(jobs, memory);

const start = () => {
    firstFit.construct();
    firstFit.simulate();
    worstFit.simulate();
    bestFit.simulate();
}

start();

const startSimulation = (type) => {
    $('#simType').html(type)
    if (type == 'First-fit') {
        simulate(firstFit);
    } else if (type == 'Worst-fit') {
        simulate(worstFit);
    } else if (type == 'Best-fit') {
        simulate(bestFit);
    }
}

async function simulate(objectAlgorithm) {
    $("#simBtn").attr("disabled", true);

    $('#simBody').html('');

    let finished = false;
    let jobs = [];
    for (let i = 0; i < objectAlgorithm.jobs.length; i++) {
        jobs.push(Object.assign({}, objectAlgorithm.jobs[i]));
    }

    let memory = [];
    for (let i = 0; i < objectAlgorithm.memory.length; i++) {
        memory.push(Object.assign({}, objectAlgorithm.memory[i]));
    }

    $('#jobsContainerSim').html('');

    // loop throught the jobs and append them to jobs container
    for (let i = 0; i < jobs.length; i++) {
        let content = `
            <div class="card">
                <div class="card-header">
                    <span class="h5">Job ${i + 1}</span>
                </div>
                <div class="card-body">
                    ${jobs[i].processing ? `<div class="text-success">Processing</div>` : `<div class="text-danger">Not Processing</div>`}
                </div>
            </div>
        `;

        $('#jobsContainerSim').append(content);
    }

    let internalFrag = 0;
    let totalCurrFrag = 0;
    let totalFrag = 0;
    let totalMemoryUsage = 0;
    let totalProcessingJobs = 0;

    let content = '';
    let time = 0;
    while(!finished) {
        finished = true;
        
        $('#simTime').html(`${time + 1}s`);
    
        totalCurrFrag = 0;
        for (let i = 0; i < jobs.length; i++) {
    
            // Check if job can be added to memory
            for (let j = 0; j < memory.length; j++) {
                internalFrag = 0;
                if (jobs[i].time == 0) {
                    continue;
                }
    
                if 
                (
                    memory[j].occupied == i || 
                    (
                    memory[j].occupied == -1 && 
                    jobs[i].processing == false &&
                    jobs[i].size <= memory[j].size
                    )
                ) {
                    
                    jobs[i].time--;
                    if (memory[j].occupied == -1) {
                        $('#simBody').append(`<tr>
                        <th class="text-center bg-danger">${time + 1}</th>
                        <th colspan="4">Job ${i + 1} added to memory ${j + 1}</th>
                        </tr>`
                        );
                    } else {
                        $('#simBody').append(`<tr>
                        <th class="text-center bg-warning">${time + 1}</th>
                        <th colspan="4">Job ${i + 1} is still processing at memory ${j + 1}</th>
                        </tr>`
                        );
                    }
    
                    internalFrag = memory[j].size - jobs[i].size;
    
                    if (jobs[i].time == 0) {
                        memory[j].occupied = -1;
                        jobs[i].processing = false;
                        // console.log(`Job ${i} finished`);
                        $('#simBody').append(`<tr>
                            <th class="text-center bg-success">${time + 1}</th>
                            <th colspan="4">Job ${i + 1} finished</th>
                        </tr>`
                        );
                    } else {
                        memory[j].occupied = i;
                        finished = false;
                        jobs[i].processing = true;
                    }
                }
    
                totalCurrFrag += internalFrag;
            }
    
            if (jobs[i].time != 0 && jobs[i].processing == false ) {
                jobs[i].waiting++;
            }
        }
    
     
        time++;

        // count the memory that is occupied
        let occupied = 0;
    
        for (let j = 0; j < memory.length; j++) {
            if (memory[j].occupied != -1) {
                occupied++;
            }
        }
    
        totalMemoryUsage += (occupied / memory.length) * 100;

        $('#simStorageUtil').html(`${(totalMemoryUsage/time).toFixed(2)}%`);
    
        // count the number of jobs that are being processed
        let processing = 0;
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].processing == true) {
                processing++;
            }
        }
    
        totalProcessingJobs += processing;

        $('#simThroughput').html(`${(totalProcessingJobs / time).toFixed(2)} jobs/s`);
 

        totalFrag += totalCurrFrag;
        $('#simIntFrag').html(`${(totalFrag / time).toFixed(2)} bytes`);
        
        // get average waiting time
        let totalWaiting = 0;
        for (let i = 0; i < jobs.length; i++) {
            totalWaiting += jobs[i].waiting;
        }


        $('#simAvgWaiting').html(`${(totalWaiting/jobs.length).toFixed(2)}`);


        $('#jobsContainerSim').html('');

        // loop throught the jobs and append them to jobs container
        for (let i = 0; i < jobs.length; i++) {
        
            if ( jobs[i].time != 0 && finished ) {
                content = `
                    <div class="card">
                        <div class="card-header">
                            <span class="h5">Job ${i + 1} </span>
                        </div>
                        <div class="card-body bg-danger">
                            <div class="text-light text-center">Too Big</div>
                        </div>
                        <div class="card-footer">
                            <span class="h6">Waiting Time: ${jobs[i].waiting}</span><br>
                            <span class="h6">Time Left: ${jobs[i].time}</span><br>
                            <span class="h6">Size: ${jobs[i].size}</span><br>
                        </div>
                    </div>
                `;
            } else if (jobs[i].time != 0) {
                content = `
                    <div class="card">
                        <div class="card-header">
                            <span class="h5">Job ${i + 1} </span>
                        </div>
                        <div class="card-body">
                            ${jobs[i].processing ? `<div class="text-success">Processing</div>` : `<div class="text-danger">Not Processing</div>`}
                        </div>
                        <div class="card-footer">
                            <span class="h6">Waiting Time: ${jobs[i].waiting}</span><br>
                            <span class="h6">Time Left: ${jobs[i].time}</span><br>
                            <span class="h6">Size: ${jobs[i].size}</span><br>
                        </div>
                    </div>
                `;
            } else {
                content = `
                <div class="card">
                    <div class="card-header">
                        <span class="h6">Job ${i + 1}</span>
                    </div>
                    <div class="card-body bg-success">
                        <div class="text-light text-center">DONE</div>
                    </div>
                    <div class="card-footer">
                        <span class="h6">Waiting Time: ${jobs[i].waiting}</span><br>
                        <span class="h6">Time Left: ${jobs[i].time}</span><br>
                        <span class="h6">Size: ${jobs[i].size}</span><br>
                    </div>
                </div>
                `;
            } 
    
            $('#jobsContainerSim').append(content);
        }

        await timer(1000);
        $('#simBody').animate({ scrollTop: $('#simBody').prop("scrollHeight") }, 1000);
    }

    $("#simBtn").attr("disabled", false);
}
