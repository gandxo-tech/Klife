import React, { useEffect, useRef } from 'react';
import { ActiveMissionState, ActiveVehicle, PlayerStats } from '../game/types.ts';
import { worldToMinimapCoords } from '../game/rules.ts';
import { GARAGE_LOCATIONS } from '../game/garages.ts';

interface MinimapProps {
  player: PlayerStats;
  vehicles: ActiveVehicle[];
  activeMission: ActiveMissionState | null;
  size?: number;
}

export const Minimap: React.FC<MinimapProps> = ({ player, vehicles, activeMission, size = 140 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapRadius = 80; // Visible world units

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, size, size);

    const half = size / 2;
    const radius = half - 5;

    // Draw circular radar background
    ctx.save();
    ctx.beginPath();
    ctx.arc(half, half, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, 0, size, size);

    // Radar concentric rings
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(half, half, radius * 0.33, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(half, half, radius * 0.66, 0, Math.PI * 2);
    ctx.stroke();

    // Radar crosshairs
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.beginPath();
    ctx.moveTo(half, 5);
    ctx.lineTo(half, size - 5);
    ctx.moveTo(5, half);
    ctx.lineTo(size - 5, half);
    ctx.stroke();

    // Draw surrounding vehicles as blips
    vehicles.forEach((veh) => {
      if (veh.id === player.currentVehicleId) return;
      const coords = worldToMinimapCoords(
        veh.x,
        veh.z,
        player.x,
        player.z,
        player.rotationY,
        mapRadius,
        size
      );

      ctx.beginPath();
      ctx.arc(coords.x, coords.y, veh.isPolice ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = veh.isPolice
        ? (Date.now() % 400 < 200 ? '#EF4444' : '#3B82F6')
        : (veh.type === 'zemidjan' ? '#FACC15' : '#94A3B8');
      ctx.fill();
    });

    // Draw Garages as orange wrench blips
    GARAGE_LOCATIONS.forEach((gar) => {
      const gcoords = worldToMinimapCoords(
        gar.x,
        gar.z + 10,
        player.x,
        player.z,
        player.rotationY,
        mapRadius,
        size
      );

      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(gcoords.x - 3, gcoords.y - 3, 6, 6);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(gcoords.x - 3, gcoords.y - 3, 6, 6);
    });

    // Draw Mission Waypoint if active
    if (activeMission) {
      const stage = activeMission.mission.stages[activeMission.currentStageIndex];
      if (stage) {
        const wp = worldToMinimapCoords(
          stage.targetX,
          stage.targetZ,
          player.x,
          player.z,
          player.rotationY,
          mapRadius,
          size
        );

        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Direction line from player to waypoint
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(half, half);
        ctx.lineTo(wp.x, wp.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Player arrow icon in center
    ctx.fillStyle = '#10B981'; // Green arrow
    ctx.beginPath();
    ctx.moveTo(half, half - 7);
    ctx.lineTo(half - 5, half + 6);
    ctx.lineTo(half, half + 3);
    ctx.lineTo(half + 5, half + 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Radar border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(half, half, radius, 0, Math.PI * 2);
    ctx.stroke();

    // North Indicator (N)
    const northAngle = -player.rotationY + Math.PI / 2;
    const nx = half + Math.sin(northAngle) * (radius - 10);
    const ny = half - Math.cos(northAngle) * (radius - 10);
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', nx, ny);
  }, [player.x, player.z, player.rotationY, vehicles, activeMission]);

  return (
    <div className="relative pointer-events-auto select-none">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full shadow-2xl border-2 border-slate-700/80 bg-slate-950/80"
      />
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700/60 rounded px-2 py-0.5 text-[10px] font-mono tracking-wider text-slate-300 uppercase shadow whitespace-nowrap">
        GPS COTONOU
      </div>
    </div>
  );
};
