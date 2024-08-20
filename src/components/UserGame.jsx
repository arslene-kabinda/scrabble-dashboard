import React from "react"

export default function UserGame({ details, score, left }) {
    return (

        <div className="w-full">
            <div className="flex gap items-start">
                {
                    left && (

                        <p>
                            {
                                score?.score ?? 0
                            }
                        </p>
                    )
                }
                <div className="flex flex-col gap items-center">
                    {
                        details?.profilePicture ? (

                            <img src={details?.profilePicture} width={50} height={50} alt="Profile picture" />
                        ) : (
                            <div className=""></div>
                        )
                    }
                    <p>
                        {
                            details?.displayName
                        }
                    </p>
                </div>
                {
                    !left && (

                        <p>
                            {
                                score?.score ?? 0
                            }
                        </p>
                    )
                }
            </div>
        </div>
    )
}