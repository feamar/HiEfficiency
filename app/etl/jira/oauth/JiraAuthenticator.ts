import UtilityObject from '../../../utilities/UtilityObject';
import OAuthManager from 'react-native-oauth';

export default class JiraAuthenticor
{
    public static instance = new JiraAuthenticor();
    private readonly manager: any;
 
    private constructor() 
    {
        this.manager = new OAuthManager("Hi Efficiency App");
        this.manager.addProvider({
               jira: 
               {
                   auth_version: '2.0',
                   authorize_url: 'https://rhaebus.atlassian.net/plugins/servlet/oauth/authorize',
                   access_token_url: 'https://rhaebus.atlassian.net/plugins/servlet/oauth/access-token',
                   request_token_url: "https://rhaebus.atlassian.net/plugins/servlet/oauth/request-token",
                   callback_url: () => "http://localhost/jira",
                   api_url: 'https://rhaebus.atlassian.net/rest/api/2',
               }
           })
           this.manager.configure({
               jira: {
                   client_id: 'Hi Efficiency App',
                   client_secret: 'MIIEowIBAAKCAQEA31syRUvK92dbzftVxw1HUxNdGW36vuRpXaLOxk8pbUKkjxc1IUJpg5L2FQluhRaFs0QGTyPxf1yYU8tRKdm/QECnIg1QIDTVelzkyHXzGtQ3FBzum2c3ssnXYXZ+38wlTVCOySC/p0L2Nz4fT8qdGB5kZkhApPCpd2LTX05SoAAEJ104mZFEl3pGzI7JvhqKYCTv3vrudtYl34yFyTJCt4ixOl5yCRbaZy9hTEoMX9TNzcq+lkpsL5+b7z5opLQZMKQaySIdE7WVLvOZlncjtjAlgOPEUcpB8SppetviXxQTOib48hFIfdzxCh1f9kSvMsc2dklkpHboXmRRlgIIJQIDAQABAoIBAAntgsmDuezPQkxgjIqBc5ckuDGmKswLWQeZcflskVnS6X+Wt3zX99qqUJfUyH3P53d1YZZo8ZYIppiq49upWw/fD866qsITtx1uPZkPbRPXNO+G7bAooVgoEpO5caA+8bWDDCWyd/JWTp1b/IZOajclOq81LPJn5BBzaxPEZnXIFRxpXJrFhhUSM5gBH/qhMPCY3NItHHALy2Z3DCwNZynLBMLz07s0VO+iRRwSnqgr7F+7E+B+J1+A1C72yBzzhRGrEDfjvq98weUn2Oen5Gsf0CynM8tKN+h2VWwGdJ+O8hdock4y2mM03MLj4Onhtu91H7ceosouom34+530S20CgYEA/S5mWxW6CLFWXEuUBRzA7agrGyg1iP83yLCdbiY+u6UykWTDl3BkfWkCBTZlACwJFvC3aKVuCLQnwEGar2PTq/7qZS2EolrdMOXYHUmBlVo6sXmKnMOYThzIKt3asMn05HyJAp/0sB6RjyJY+NspusQUINZt/1oSPFjVeRcSEKMCgYEA4dfKkkbAZcQxZDPBjvS8KmckVDopFp+Vn9zmmYRn3UQ8xAAWiBKVWZGJe4Ri1JdnISSo23iiv/bWLtUwgPHQsaNB2TRE7oeuLMB5QA6rM5NkVX4hqWbSq8tmCJ9M5BHGt12wy0owOq9VOmFW600kjM31VQ3EM+q9jgApM8+IaJcCgYBkXomrYGCg45TGABxNLon5bWqxWG5owizePc4bhcPm5eW3KAg2OBNOeFuZr2e4+rwbwRAkxzho8Oq1WAy3rU6T5/oKZFIpfvYjVWsoqSRbDisognOGFDCD/vsHq23wGhAgqJI0XS9GxseTw90bwt63MNZ98iQnUBDcpabzW0cJGwKBgE8PGYzHU8bMPXYUYCfJKK23WZJaodOXnetOizMmlK1ym8sJNNoBl2K5feVNXMOLFMEXcj0SJ/cHU8clPkuFW0c0HXMJxy+xM5na7xcri2cMq8z50JLaudkF5PwTt/kG+Adstt0TZXrFshIzzRel86uO1dkmbo62GBFDoSjP97KVAoGBAPCtlV1fl0ZmLbjleefVmGVdQ8k/cmyHR9urdBnfKnErl4cV55jCFygDwUUhVGVRgzi2AJD1DMvVYe2vCiX59ZPd8KKnVa4Y2LNKr64UVMZTEXyDpaTBZKM468rTAau4XLKnSreuvtEsSFnwdvV8Nx3NOlxJs1NFxiKW/cSVQnK8'
               }
           });
    }

    authorize = async () =>
    {
        try
        {
            const response = await this.manager.authorize('jira');
            console.log("RESPONSE: " + UtilityObject.stringify(response));
        }
        catch(e)
        {
            console.log("ERROR: " + UtilityObject.stringify(e));
        }
    }

    getIssues = async () =>
    {
        try
        {
            const response = await this.manager.makeRequest('jira', "/user");
            console.log("RESPONSE: " + UtilityObject.stringify(response));
        }
        catch(e)
        {
            console.log("ERROR: " + UtilityObject.stringify(e));
        }
    }
}