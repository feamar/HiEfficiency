import OAuthManager from 'react-native-oauth';
import UtilityObject from '../../../utilities/UtilityObject';

export default class GitHubAuthenticor
{
    public static instance = new GitHubAuthenticor();
    private readonly manager: any;

    private constructor() 
    {
        this.manager = new OAuthManager("HiEfficiency");
        this.manager.configure({
            github: {
                auth_version: '2.0',
                authorize_url: 'https://github.com/login/oauth/authorize',
                access_token_url: 'https://github.com/login/oauth/access_token',
                api_url: 'https://api.github.com',
                callback_url: () => `http://localhost/github`,
                client_id: 'f0d848453d031dfaba52',
                client_secret: 'ba4e1b6fe85b97d9248303c4ea7cf76f56c93a49'
            }
        });
    }

    authorize = async () =>
    {
        try
        {
            const response = await this.manager.authorize('github');
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
            const response = await this.manager.makeRequest('github', "/user");
            console.log("RESPONSE: " + UtilityObject.stringify(response));
        }
        catch(e)
        {
            console.log("ERROR: " + UtilityObject.stringify(e));
        }
    }
}