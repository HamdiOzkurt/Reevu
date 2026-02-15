import React from "react";
import Svg, {
    Circle,
    Defs,
    LinearGradient,
    Path,
    Stop,
} from "react-native-svg";

interface ReevuLogoProps {
  size?: number;
  color?: string;
}

export default function ReevuLogo({ size = 32, color }: ReevuLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="64" y2="64">
          <Stop offset="0" stopColor={color ?? "#3B82F6"} />
          <Stop offset="1" stopColor={color ? color : "#6366F1"} />
        </LinearGradient>
      </Defs>
      {/* Outer circle */}
      <Circle cx="32" cy="32" r="30" fill="url(#grad)" />
      {/* R letter stylized */}
      <Path
        d="M22 18h12c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4l10 12h-7l-9-12h-2v12h-6V18h6zm6 6v4h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6z"
        fill="#FFF"
      />
    </Svg>
  );
}
