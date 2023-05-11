import React, { useEffect, useRef, useState } from 'react'
import Papa from "papaparse";
import { Handle, Position } from 'reactflow';
import { useDispatch } from 'react-redux';
import { addImage } from '../../Slices/ChartSlices';

function UploadFile({id}) {
  const [fileData, setFileData] = useState();
  const [gridRow, setGridRow] = useState();
  const [gridColumn, setGridColumn] = useState();
  const [imageUrl, setImageUrl] = useState();

  const dispatch = useDispatch()

  const changeHandler = (event) => {
    event.preventDefault()
    // console.log(props)
    Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function(results) {
            const tempRow = [];
            const tempCol = [];

            results.data.map(d => {
                tempRow.push(Object.keys(d));
                if(tempCol.length < 5) tempCol.push(Object.values(d));
            })

            setFileData(results.data)
            localStorage.setItem('csv-data', results.data);
            setGridColumn(tempCol);
            setGridRow(tempRow[0]);

            // Send csv to backend
            const formData = new FormData()
            formData.append('file', event.target.files[0]);
            try {
                const response = await fetch('http://localhost:8000/api/', {
                    method: "POST",
                    body: formData
                })
                
                const imageBlob = await response.blob();
                // console.log(imageBlob)
                const imageUrl = URL.createObjectURL(imageBlob);

                // Update state with image URL
                setImageUrl(imageUrl);
                dispatch(addImage({id, imageUrl}))
            } catch (error) {
                console.error(error)
            }
        }
    })
  }

  // TODO: Save csv file localstorage
//   useEffect(() => {
//     const tempData = localStorage.getItem('csv-data');
//     if(tempData) {
//         const tempRow = [];
//         const tempCol = [];

//         tempData.map(d => {
//             tempRow.push(Object.keys(d));
//             if(tempCol.length < 5) tempCol.push(Object.values(d));
//         })

//         setGridColumn(tempCol);
//         setGridRow(tempRow[0]);  
//         setFileData(tempData)      
//     }
//   }, [])

  return (
    <div className='bg-[rgba(0,0,0,0.25)] text-[10px] p-4 rounded-sm text-white'>
        <Handle type='source' position={Position.Right}></Handle>
        {fileData === undefined ? 
        <>
            <h3 className='mb-2'>Please upload a CSV file</h3>
            <input type="file" className="block w-full text-[8px] text-slate-500
            file:mr-2 file:px-3 file:py-1
            file:rounded-full file:border-0
            file:text-[8px] file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100 file:cursor-pointer
            " onChange={changeHandler}/>
        </> : 
        <>
            <p className='font-medium text-[10px] mb-1'>File uploaded successfully.</p>
            <div className='p-2 border w-60 h-40 overflow-x-scroll overflow-y-hidden custom-scroll'>
                <table className='w-full text-[8px] text-left text-gray-500'>
                    <thead className='text-xs text-white0 uppercase bg-gray-50'>
                        <tr>
                            {gridRow.map((rows, index) => {
                                return <th scope='col' className='px-2 text-[9px] py-1' key={index}>{rows}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {gridColumn.map((cols, index) => {
                            return <tr className='bg-white border-b' key={index}>
                                {cols.map((col, ind) => {
                                    return <td className='px-2 py-1' key={ind}>{col}</td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            
            <p className='text-[8px] font-light mt-1'>Showing first 5 results</p>
            {/* <img src={imageUrl} alt="" /> */}
        </>}
    </div>
  )
}

export default UploadFile