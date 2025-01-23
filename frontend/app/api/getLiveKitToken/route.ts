import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export const POST= async(req:Request)=> {
  
  const { roomName, userName } =await  req.json();
  const apiKey = 'devkey' ;
  const apiSecret ='secret' ;

  const at = new AccessToken(apiKey, apiSecret, { identity: userName });
  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: false});

  const token = await at.toJwt();
  return NextResponse.json({ token });
}