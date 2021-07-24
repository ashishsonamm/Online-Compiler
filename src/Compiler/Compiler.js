import React from "react";

import "./Compiler.css";
require("dotenv").config();

const Compiler = () => {
    let sourceCode;
    let customInput;
    let language_id;
    console.log(`key is ${process.env.REACT_APP_API_KEY}`);

    const language = (e) => {
        e.preventDefault();
        language_id = e.target.value;
        console.log(language_id);
    };

    const onChangeSource = (e) => {
        console.log(e.target.value);
        sourceCode = e.target.value;
    };
    const onChangeCustomInput = (e) => {
        console.log(e.target.value);
        customInput = e.target.value;
    };

    const submitCode = async (e) => {
        e.preventDefault();
        let outputText = document.getElementById("console");
        outputText.innerHTML = `Submission queued...\n`;

        const response = await fetch(
            "https://judge0-ce.p.rapidapi.com/submissions",
            {
                method: "POST",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "x-rapidapi-key": process.env.REACT_APP_API_KEY,
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    source_code: sourceCode,
                    stdin: customInput,
                    language_id: language_id || 54,
                }),
            }
        );
        const jsonResponse = await response.json();
        console.log(jsonResponse.token);

        let jsonApiOutput = {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
        };

        if (jsonResponse.token) {
            let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

            const apiOutput = await fetch(url, {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "x-rapidapi-key": process.env.REACT_APP_API_KEY,
                    "content-type": "application/json",
                },
            });

            jsonApiOutput = await apiOutput.json();
            console.log(jsonApiOutput);
        }

        outputText.innerHTML = "";

        if (jsonApiOutput.stdout) {
            const output = atob(jsonApiOutput.stdout);
            console.log(output);
            outputText.innerHTML = `Result: \n${output}\nTime Elapsed: ${jsonApiOutput.time} s\nMemory used: ${jsonApiOutput.memory} bytes`;
        } else if (jsonApiOutput.stderr) {
            const error = atob(jsonApiOutput.stderr);
            outputText.innerHTML = `\n Error :${error}`;
        } else {
            const compilation_error = atob(jsonApiOutput.compile_output);
            outputText.innerHTML = `\n Error :${compilation_error}`;
        }
    };

    return (
        <div>
            <div className="row container-fluid">
                <div className="col-6 col-4">
                    <span>Code Here</span>
                    <textarea
                        required
                        name="source"
                        id="source"
                        onChange={onChangeSource}
                        className="source"
                    ></textarea>
                    <select value={language_id} onChange={language} id="tags">
                        <option value="54">C++</option>
                        <option value="50">C</option>
                        <option value="62">Java</option>
                        <option value="71">Python</option>
                    </select>
                    <button
                        type="submit"
                        onClick={submitCode}
                        className="btn btn-primary ml-2 mr-2"
                    >
                        Run
                    </button>
                    <br />
                    <span>Custom Input</span>
                    <textarea
                        name="customInput"
                        id="customInput"
                        onChange={onChangeCustomInput}
                        className="customInput"
                    ></textarea>
                </div>

                {/* </div> */}
                <div className="col-4">
                    <span>Console</span>
                    <textarea
                        name="console"
                        id="console"
                        className="console"
                        // onChange={onChangeSource}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
