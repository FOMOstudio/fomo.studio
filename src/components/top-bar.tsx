export function TopBar() {
  return (
    <div className="fixed flex items-center top-0 right-0 left-0 h-14">
      <div className="flex items-center justify-between mx-auto w-full px-4">
        <span className="text-base font-bold relative">
          FOMO
          <span> *</span>
        </span>
      </div>
    </div>
  );
}
