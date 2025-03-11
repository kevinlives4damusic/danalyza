import { PromotionalBanner } from "@/components/PromotionalBanner";
import { useUser } from "@/components/auth/UserContext";

const Upload = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Add floating banner for non-premium users */}
      {!user?.isPremium && <PromotionalBanner variant="floating" />}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Add compact banner for non-premium users */}
          {!user?.isPremium && (
            <div className="mb-6">
              <PromotionalBanner variant="compact" />
            </div>
          )}

          {/* Rest of the upload page content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Your existing upload components */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload; 