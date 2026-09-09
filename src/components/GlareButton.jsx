"use client";
import GlareHover from "./GlareHover";

export default function GlareButton({ as: Component = "button", children, ...props }) {
  return (
    <GlareHover
      asChild
      glareColor="#ffffff"
      glareOpacity={0.3}
      glareAngle={-30}
      glareSize={300}
      transitionDuration={800}
      playOnce={false}
    >
      <Component {...props}>{children}</Component>
    </GlareHover>
  );
}
