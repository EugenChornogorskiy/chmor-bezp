"use client";

import { useEffect, useState } from "react";
import { StatsDisplay } from "../components/StatsDisplay";
import { useParams } from 'react-router-dom';
import { useLogin } from "../contexts/Login";
export default function Stats() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [backId, setBackId] = useState<any>(null);
  const [requestCount, setRequestCount] = useState(null);
  const [serverTime, setServerTime] = useState<any>(null);
  const {token}:any = useLogin()
  useEffect(() => {
    fetch(`/api/stats?name=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBackId(data.instanceId)
        setPokemon(data.pokemon);
        setRequestCount(data.requestCount)
        setServerTime(data.serverTime)
        console.log(data.pokemon,data.instanceId)
      });
  }, [id]);

  if (!pokemon) return <div>Loading...</div>;

  return <StatsDisplay dane={pokemon} backId={backId} requestCount={requestCount} serverTime={serverTime}/>;
}