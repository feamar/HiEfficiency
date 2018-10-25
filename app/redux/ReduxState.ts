import ReduxUser from "../dtos/redux/ReduxUser";
import ReduxInspecting from "../dtos/redux/ReduxInspecting";

export type ReduxState =
{
    user: ReduxUser | null ;
    inspecting: ReduxInspecting;
}
