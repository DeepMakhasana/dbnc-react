import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const SingleProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  console.log(params);

  const forms = [
    {
      title: "Main Information",
      slug: "main-information",
    },
    {
      title: "Address Information",
      slug: "address-information",
    },
    {
      title: "Feedback & UPI id",
      slug: "feedback-upi",
    },
    {
      title: "Category & Services",
      slug: "category-service",
    },
    {
      title: "Impotent Links",
      slug: "impotent-links",
    },
    {
      title: "Photos",
      slug: "photos",
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-medium line-clamp-1">Manage profile</h1>
            <p className="text-sm hidden text-muted-foreground sm:block">View and manage profile</p>
          </div>
        </div>
        {/* <div className="flex gap-2 items-center">
          <Button className="flex gap-2 items-center">
            add
            </Button>
        </div> */}
      </div>
      {/* container */}
      <div className="grid gap-3">
        {forms.map((form) => (
          <div key={form.slug} className="flex justify-between items-center border rounded p-4">
            <p>{form.title}</p>
            <Link to={`/profile/update?id=${params.storeId}&slug=${form.slug}`}>
              <Button size={"icon"}>
                <Edit />
              </Button>
            </Link>
          </div>
        ))}

        <div className="flex justify-between items-center border rounded p-4">
          <p>Secret Pin</p>
          <Link to={`/profile/secret/${params.storeId}`}>
            <Button size={"icon"}>
              <Edit />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SingleProfile;
