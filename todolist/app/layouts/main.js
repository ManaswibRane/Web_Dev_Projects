"use client"
import React, { useState } from 'react'

const page = () => {
    const [title, settitle] = useState("");
    const [desc, setdesc] = useState("");
    const [mainTask, setMainTask] = useState([])
    const submitHandler = (e) => {
        e.preventDefault();
        console.log("Submited")
        setMainTask([...mainTask, { title, desc }]);
        console.log(mainTask);
        setdesc("");
        settitle("")

    }
    let deleteHandler=(i)=>{
        let cp=[...mainTask];
        cp.splice(i,1);
        setMainTask(cp);
    }
    let renderTask = "No Task Available"
    if (mainTask.length > 0) {
        renderTask = mainTask.map((t, i) => {
            return (
                <li key={i}>
                    <div className='flex justify-between'>
                        <h1>{t.title}</h1>
                        <h3>{t.desc}</h3>
                        <button onClick={() => {
                            { deleteHandler(i) };
                        }}>Delete</button>
                    </div>
                </li>

            )
        })
    }

    return (

        <>
            <form onSubmit={submitHandler}>
                <input type="text" className='border-2 m-5 px-4 py-2' placeholder='Enter your task' value={title} onChange={(e) => {
                    settitle(e.target.value);

                }}></input>
                <input type="text" className='border-2 m-5 px-4 py-2' placeholder='Enter Description' value={desc} onChange={(e) => {
                    setdesc(e.target.value)

                }}></input>
                <button>Add task</button>
            </form>
            <hr className='bg-amber-900' />
            <div className='p-3 bg-amber-100'>
                <ul>
                    <li>{renderTask}</li>
                </ul>

            </div>
        </>

    )
}

export default page