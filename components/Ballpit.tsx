"use client"

import { useEffect, useRef, useCallback } from "react"

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  mass: number
}

interface BallpitProps {
  count?: number
  gravity?: number
  friction?: number
  wallBounce?: number
  followCursor?: boolean
}

export default function Ballpit({
  count = 200,
  gravity = 0.7,
  friction = 0.8,
  wallBounce = 0.95,
  followCursor = true,
}: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const ballsRef = useRef<Ball[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ]

  const createBall = useCallback((canvas: HTMLCanvasElement): Ball => {
    const radius = Math.random() * 8 + 4
    return {
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: Math.random() * (canvas.height - radius * 2) + radius,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      mass: radius * 0.1,
    }
  }, [])

  const updateBall = useCallback(
    (ball: Ball, canvas: HTMLCanvasElement, mouse: { x: number; y: number }) => {
      // Apply gravity
      ball.vy += gravity * 0.1

      // Mouse attraction if followCursor is enabled
      if (followCursor) {
        const dx = mouse.x - ball.x
        const dy = mouse.y - ball.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) * 0.0001
          ball.vx += (dx / distance) * force
          ball.vy += (dy / distance) * force
        }
      }

      // Update position
      ball.x += ball.vx
      ball.y += ball.vy

      // Wall collisions
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius
        ball.vx *= -wallBounce
      }
      if (ball.x + ball.radius >= canvas.width) {
        ball.x = canvas.width - ball.radius
        ball.vx *= -wallBounce
      }
      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius
        ball.vy *= -wallBounce
      }
      if (ball.y + ball.radius >= canvas.height) {
        ball.y = canvas.height - ball.radius
        ball.vy *= -wallBounce * 0.8 // Less bouncy on ground
      }

      // Apply friction
      ball.vx *= friction
      ball.vy *= friction
    },
    [gravity, friction, wallBounce, followCursor],
  )

  const checkCollision = useCallback((ball1: Ball, ball2: Ball) => {
    const dx = ball2.x - ball1.x
    const dy = ball2.y - ball1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const minDistance = ball1.radius + ball2.radius

    if (distance < minDistance) {
      // Collision detected - simple elastic collision
      const angle = Math.atan2(dy, dx)
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)

      // Rotate velocities
      const vx1 = ball1.vx * cos + ball1.vy * sin
      const vy1 = ball1.vy * cos - ball1.vx * sin
      const vx2 = ball2.vx * cos + ball2.vy * sin
      const vy2 = ball2.vy * cos - ball2.vx * sin

      // Collision reaction
      const totalMass = ball1.mass + ball2.mass
      const newVx1 = ((ball1.mass - ball2.mass) * vx1 + 2 * ball2.mass * vx2) / totalMass
      const newVx2 = ((ball2.mass - ball1.mass) * vx2 + 2 * ball1.mass * vx1) / totalMass

      // Rotate back
      ball1.vx = newVx1 * cos - vy1 * sin
      ball1.vy = vy1 * cos + newVx1 * sin
      ball2.vx = newVx2 * cos - vy2 * sin
      ball2.vy = vy2 * cos + newVx2 * sin

      // Separate balls
      const overlap = minDistance - distance
      const separateX = (dx / distance) * overlap * 0.5
      const separateY = (dy / distance) * overlap * 0.5

      ball1.x -= separateX
      ball1.y -= separateY
      ball2.x += separateX
      ball2.y += separateY
    }
  }, [])

  const drawBall = useCallback((ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)

    // Create gradient for 3D effect
    const gradient = ctx.createRadialGradient(
      ball.x - ball.radius * 0.3,
      ball.y - ball.radius * 0.3,
      0,
      ball.x,
      ball.y,
      ball.radius,
    )
    gradient.addColorStop(0, ball.color)
    gradient.addColorStop(1, ball.color + "80")

    ctx.fillStyle = gradient
    ctx.fill()

    // Add highlight
    ctx.beginPath()
    ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.fill()
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw balls
    const balls = ballsRef.current
    for (let i = 0; i < balls.length; i++) {
      updateBall(balls[i], canvas, mouseRef.current)

      // Check collisions with other balls
      for (let j = i + 1; j < balls.length; j++) {
        checkCollision(balls[i], balls[j])
      }

      drawBall(ctx, balls[i])
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [updateBall, checkCollision, drawBall])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight

    // Recreate balls for new dimensions
    ballsRef.current = Array.from({ length: count }, () => createBall(canvas))
  }, [count, createBall])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initial setup
    handleResize()

    // Event listeners
    window.addEventListener("resize", handleResize)
    if (followCursor) {
      canvas.addEventListener("mousemove", handleMouseMove)
    }

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (followCursor) {
        canvas.removeEventListener("mousemove", handleMouseMove)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, handleResize, handleMouseMove, followCursor])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  )
}
