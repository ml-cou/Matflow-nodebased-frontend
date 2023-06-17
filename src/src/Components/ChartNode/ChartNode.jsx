import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Handle, Position, useReactFlow } from 'reactflow'

function ChartNode(props) {
    const [image, setImage] = useState()

    useEffect(() => {
        if(!props) return
        if(props.data) {
            setImage(props.data.imageUrl)
        }
    }, [props]);

  return (
    <div className='bg-[rgba(0,0,0,0.25)] w-48 h-36 rounded-sm grid place-items-center p-4' >
        <Handle type='source' position={Position.Right}></Handle>
        <Handle type='target' position={Position.Left}></Handle>
        {!image ? <h3 className='text-[12px] font-medium text-white' onClick={() => console.log(image)}>Chart Image</h3> : <img className='object-cover' src={image} />}
    </div>
  )
}

export default ChartNode