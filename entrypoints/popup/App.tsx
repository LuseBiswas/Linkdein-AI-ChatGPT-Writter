
import './App.css';
import Blob from '../../assets/blob.svg';
function App() {

  return (
    <>
      
       <div className='flex flex-col items-center p-[30px] gap-3'> <img src={Blob} alt="" className='h-8 w-8 bg-black rounded-full ' />
       <h1 className='text-lg font-bold'>LinkedIn AI</h1></div>
       <div className='pl-[30px] pr-[30px] '>
        <p className='text-base font-semibold text-slate- mb-2 text-center'>Welcome to ChatGPT Writer</p>
        <p className='text-sm text-center'>LinkedIn AI is a Chrome extension that helps you generate messages in a proffesional manner.</p>
        <div className='mt-4 flex justify-center items-center '><button className='bg-[#80ed99] text-white pb-[6px] pt-[6px] w-52 rounded-md hover:bg-[#80ed99]'>Visit</button></div>
       </div>
     
    </>
  );
}

export default App;