import Image from 'next/image'
import React from 'react'

const Profile = ({ defaultAccount, userBalance, errorMessage, connectWalletHandler, connButtonText }) => {

    return (
        <div className='card bg-base-200 p-8 shadow-xl border border-warning lg:mr-4 w-full'>
            <div className="grid flex-grow card place-items-center ">
                <h1 className='text-3xl mb-5 font-bold'>User Account Details</h1>
                <div className="avatar">
                    
                </div>
                <div className="">
                    <div className="flex flex-col items-center">
                        <div className="stat-title">Account Address</div>
                        <div className="stat-value text-warning text-xs lg:text-base"> {defaultAccount}</div>
                    </div>
                </div>
                <div className="shadow-2xl stats my-4 border border-black w-full  md:w-[45%] mx-auto ">
                    <div className="stat">
                        <div className="stat-title">Balance</div>
                        <div className="stat-value text-warning"> {userBalance ? userBalance.substring(0, 8) : 0.0} <span className='text-base'>ETH</span></div>
                        <div className="stat-desc">Total Balance</div>
                    </div>
                </div>
                <button disabled={errorMessage || connButtonText === "Wallet Connected"} onClick={connectWalletHandler} className='btn  btn-outline btn-warning w-full mb-2 md:w-[45%] mx-auto'>{connButtonText}</button>
            </div>
        </div>
    )
}

export default Profile
