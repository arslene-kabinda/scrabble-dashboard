import React from "react"

export default function UserGame({ details }) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex gap items-center">
                <div className="flex flex-col gap items-center">
                    {
                        details?.profilePicture ? (

                            <img className="w-14 h-14 object-center object-cover rounded-full" alt='User avatar' src={details?.profilePicture} width={50} height={50} />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-500"></div>
                        )
                    }
                    <p>
                        {
                            details?.displayName
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}