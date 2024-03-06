import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="container flex mx-auto justify-between items-center">
        <div>FileDrive</div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
