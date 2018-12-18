import ChartGranularity30m from "./granularity/models/granularities/ChartGranularity30m";
import ChartGranularity1H from "./granularity/models/granularities/ChartGranularity1H";
import ChartGranularity6H from "./granularity/models/granularities/ChartGranularity6H";
import ChartGranularity1D from "./granularity/models/granularities/ChartGranularity1D";
import ChartGranularity1W from "./granularity/models/granularities/ChartGranularity1W";
import ChartGranularity15m from "./granularity/models/granularities/ChartGranularity15m";

export default class VsmConstants
{
    public static readonly GRANULARITIES = [new ChartGranularity15m(), new ChartGranularity30m(), new ChartGranularity1H(), new ChartGranularity6H(), new ChartGranularity1D(), new ChartGranularity1W()];
}