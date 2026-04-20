export default function LoginEarth() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-24 overflow-hidden lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[48%]">
      <div className="earth-stage" aria-hidden="true">
        <div className="earth-orbit-ring earth-orbit-ring-one" />
        <div className="earth-orbit-ring earth-orbit-ring-two" />
        <div className="earth-globe">
          <div className="earth-clouds" />
          <div className="earth-shade" />
        </div>
      </div>
    </div>
  );
}
