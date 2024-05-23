# Sample Script

## Part 1: Plain/Raw Node JS Callbacks

- [part1_raw.js](./solution/part1_raw.js)

## Part 2: Flow Libraries

- [part2_async.js](./solution/part2_async.js) - Async
- [part2_step.js](./solution/part2_step.js) - Step

## Part 3: Promises

- [part3_promise.js](./solution/part3_promise.js)

## Part 4 (Bonus): Streams

- [bonus_stream.js](./solution/bonus_stream.js) - Stream



## Instructions on How to Run This Node.js Project

1. **Install Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

2. **Clone the Repository**: Clone this repository to your local machine using the following command:
    ```sh
    git clone <repository-url>
    cd sample_script
    ```

3. **Navigate to the Solution Directory**: Change to the `solution` directory where the scripts are located:
    ```sh
    cd solution
    ```

4. **Install Dependencies**: Dependencies can be installed using npm:
    ```sh
    npm install
    ```

5. **Run the Scripts**: Each script can be run using Node.js. For example, to run `part1_raw.js`:
    ```sh
    node part1_raw.js
    ```

    Similarly, you can run the other scripts by replacing `part1_raw.js` with the desired script name:
    ```sh
    node part2_async.js
    node part2_step.js
    node part3_promise.js
    node bonus_rxjs.js
    node bonus_stream.js
    ```

6. **Testing the Server**: If the scripts are server scripts, you can test them by navigating to `http://localhost:3000/I/want/title/?address=google.com` in your web browser (assuming the server is set to listen on port 3000).

7. **Stopping the Server**: To stop a running server, you can use `Ctrl + C` in the terminal where the server is running.

Following is an example URL for testing:
`http://localhost:3000/I/want/title/?address=google.com&address=www.bing.com&address=www.yahoo.com.pk&address=en.wikipedia.org/wiki/Main`

```File Tree:
sample_script/
├── README.md
└── solution/
    ├── part1_raw.js
    ├── part2_async.js
    ├── part2_step.js
    ├── part3_promise.js
    ├── bonus_rxjs.js
    └── bonus_stream.js```
