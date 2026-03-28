(function () {
  const canvas = document.getElementById('flightCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const points = [
      {x: 80, y: 270}, {x: 180, y: 110}, {x: 320, y: 155}, {x: 450, y: 88},
      {x: 575, y: 210}, {x: 705, y: 150}, {x: 835, y: 84}
    ];
    const drone = { t: 0 };
    const obstacle = { x: 430, y: 140, r: 34 };
    let clock = 0;

    function lerp(a, b, t) { return a + (b - a) * t; }
    function alongPath(t) {
      const seg = points.length - 1;
      const idx = Math.min(seg - 1, Math.floor(t * seg));
      const lt = (t * seg) - idx;
      const a = points[idx], b = points[idx + 1];
      return { x: lerp(a.x, b.x, lt), y: lerp(a.y, b.y, lt) };
    }
    function drawField() {
      ctx.fillStyle = '#e8f3e5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(83,130,84,.2)';
      for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 28 + 10);
        ctx.lineTo(canvas.width, i * 28 + 10);
        ctx.stroke();
      }
    }
    function drawMainPath() {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0f7a78';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
      for (const p of points) {
        ctx.fillStyle = '#125d71';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    function drawObstacleAndDetour(drPos) {
      const pulse = 2 + Math.sin(clock * 0.01) * 2;
      ctx.strokeStyle = 'rgba(214,75,61,.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, obstacle.r + pulse, 0, Math.PI * 2);
      ctx.stroke();

      const near = Math.hypot(drPos.x - obstacle.x, drPos.y - obstacle.y) < obstacle.r + 35;
      if (near) {
        ctx.strokeStyle = '#d64b3d';
        ctx.setLineDash([7, 6]);
        ctx.beginPath();
        ctx.moveTo(drPos.x, drPos.y);
        ctx.quadraticCurveTo(obstacle.x + 65, obstacle.y - 74, obstacle.x + 145, obstacle.y - 26);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      return near;
    }
    function drawDrone(pos) {
      ctx.fillStyle = '#f29d38';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4f2d07';
      ctx.fillRect(pos.x - 14, pos.y - 2, 28, 4);
      ctx.fillRect(pos.x - 2, pos.y - 14, 4, 28);
    }

    const status = {
      sense: document.querySelector('[data-key="sense"]'),
      cost: document.querySelector('[data-key="cost"]'),
      replan: document.querySelector('[data-key="replan"]'),
      coord: document.querySelector('[data-key="coord"]'),
      detect: document.querySelector('[data-key="detect"]'),
      resume: document.querySelector('[data-key="resume"]')
    };
    function setPill(el, type, text) {
      if (!el) return;
      el.className = 'pill ' + type;
      el.textContent = text;
    }

    function animate() {
      clock += 1;
      drone.t += 0.0028;
      if (drone.t > 1) drone.t = 0;
      const pos = alongPath(drone.t);
      const near = Math.hypot(pos.x - obstacle.x, pos.y - obstacle.y) < obstacle.r + 35;
      drawField();
      drawMainPath();
      drawDrone(pos);
      const doingDetour = drawObstacleAndDetour(pos);

      setPill(status.sense, near ? 'active' : 'done', near ? '触发中' : '已就绪');
      setPill(status.cost, near ? 'active' : 'done', near ? '更新中' : '已完成');
      setPill(status.replan, doingDetour ? 'warn' : 'done', doingDetour ? '重规划中' : '已完成');
      setPill(status.coord, drone.t > 0.45 ? 'done' : 'active', drone.t > 0.45 ? '已通过' : '检查中');
      setPill(status.detect, (clock % 160 < 80) ? 'active' : 'done', (clock % 160 < 80) ? '推理中' : '已输出');
      setPill(status.resume, drone.t > 0.75 ? 'done' : 'pending', drone.t > 0.75 ? '已恢复' : '待恢复');
      requestAnimationFrame(animate);
    }
    animate();
  }

  const gallery = document.getElementById('gallery');
  if (gallery) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    gallery.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  }
})();
