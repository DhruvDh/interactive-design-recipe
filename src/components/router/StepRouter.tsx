import { useParams } from "react-router-dom";
import Step0 from "../../pages/Step0";
import Step1 from "../../pages/Step1";
import Step2 from "../../pages/Step2";
import Step3 from "../../pages/Step3";
import Step4 from "../../pages/Step4";
import Step5 from "../../pages/Step5";

export default function StepRouter() {
  const { id } = useParams<{ id: string }>();

  switch (id) {
    case "0":
      return <Step0 />;
    case "1":
      return <Step1 />;
    case "2":
      return <Step2 />;
    case "3":
      return <Step3 />;
    case "4":
      return <Step4 />;
    case "5":
      return <Step5 />;
    default:
      return (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-8">
              Step {id} — Coming Soon
            </h1>
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <p className="text-neutral-600">
                This step is not implemented yet. Please check back later.
              </p>
            </div>
          </div>
        </div>
      );
  }
}
