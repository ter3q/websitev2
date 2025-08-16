import { useLanyard } from "react-use-lanyard";

export default function PageProfile() {
    const { loading, status } = useLanyard({
        userId: "988061028489236579",
        socket: true,
    });

    if (loading || !status) {
        return <p className="text-center mt-10"></p>;
    }

    const username = status.discord_user.username;
    const avatar = status.discord_user.avatar;
    const userId = status.discord_user.id;
    const discordStatus = status.discord_status;
    const spotify = status.spotify;
    const Activity = !spotify
        ? status.activities?.find(
            (act) => act.type !== 2 && act.name !== "Spotify"
        )
        : null;

    const activityImageUrl = Activity?.assets?.large_image
        ? `https://cdn.discordapp.com/app-assets/${Activity.application_id}/${Activity.assets.large_image.replace("mp:", "")}.png`
        : null;

    const displayStatus = spotify ? "Listening to Spotify" : Activity ? <p>Playng {Activity.name}</p> : discordStatus || "offline";

    return (
        <>
            <div>
            <br></br>
            <h1 className=" text-center text-6xl font-bold my-50">Test</h1>
            </div>

            <div
                className="bg-gradient-to-r from-blue-500 to-blue-300
                w-96 h-auto m-auto rounded-xl shadow-2xl
                transform hover:scale-110 transition-transform
                text-white relative p-6"
            >
                <div className="flex justify-start items-center gap-4 mb-6">
                    <img
                        src={`https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <p className="text-lg font-medium text-black">{username}</p>
                        <p className="text-sm text-black">{displayStatus}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2 text-black"></h2>

                    {spotify ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={spotify.album_art_url}
                                alt="Spotify Album Art"
                                className="w-16 h-16 rounded-md"
                            />
                            <div className="text-black">
                                <p>{spotify.song}</p>
                                <p>{spotify.artist}</p>
                            </div>
                        </div>
                    ) : Activity ? (
                        <div className="flex items-center gap-4">
                            {activityImageUrl && (
                                <img
                                    src={activityImageUrl}
                                    alt="Activity Icon"
                                    className="w-16 h-16 rounded-md"
                                />
                            )}
                            <p className="text-black">{Activity.name}</p>
                        </div>
                    ) : (
                        <p className="text-black"></p>
                    )}
                </div>
            </div>
            <div className="min-h-screen flex justify-center items-center flex-wrap">
                
            </div>
        </>
    );
}