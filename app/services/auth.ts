import { OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';
import type { HttpClient } from '@bity/oauth2-auth-code-pkce';

export const lichessHost = 'https://lichess.org';
// export const lichessHost = 'http://l.org';
export const scopes = ['board:play'];
export const clientId = 'lichess-api-demo';
export const clientUrl = typeof window !== 'undefined' ? window.location.origin + '/' : 'http://localhost:3000/';

export interface Me {
	id: string;
	username: string;
	httpClient: HttpClient; // with pre-set Authorization header
	perfs: { [key: string]: any };
}

export class LichessAuth {
	private _oauth?: OAuth2AuthCodePKCE;
	me?: Me;

	private get oauth(): OAuth2AuthCodePKCE {
		if (!this._oauth && typeof window !== 'undefined') {
			this._oauth = new OAuth2AuthCodePKCE({
				authorizationUrl: `${lichessHost}/oauth`,
				tokenUrl: `${lichessHost}/api/token`,
				clientId,
				scopes,
				redirectUrl: clientUrl,
				onAccessTokenExpiry: refreshAccessToken => refreshAccessToken(),
				onInvalidGrant: console.warn,
			});
		}
		if (!this._oauth) {
			throw new Error('OAuth cannot be initialized on server side');
		}
		return this._oauth;
	}

	async init() {
		if (typeof window === 'undefined') return;
		try {
			const accessContext = await this.oauth.getAccessToken();
			if (accessContext) await this.authenticate();
		} catch (err) {
			console.error(err);
		}
		if (!this.me) {
			try {
				const hasAuthCode = await this.oauth.isReturningFromAuthServer();
				if (hasAuthCode) await this.authenticate();
			} catch (err) {
				console.error(err);
			}
		}
	}

	async login() {
		await this.oauth.fetchAuthorizationCode();
	}

	async logout() {
		if (this.me) await this.me.httpClient(`${lichessHost}/api/token`, { method: 'DELETE' });
		if (typeof window !== 'undefined') {
			localStorage.removeItem('oauth2authcodepkce-state');
		}
		this.me = undefined;
	}

	private authenticate = async () => {
		if (typeof window === 'undefined') return;
		const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
		const res = await httpClient(`${lichessHost}/api/account`);
		const me = {
			...(await res.json()),
			httpClient,
		};
		if (me.error) throw me.error;
		this.me = me;
	};


	fetchBody = async (path: string, config: any = {}) => {
		const res = await this.fetchResponse(path, config);
		const body = await res.json();
		return body;
	};

	private fetchResponse = async (path: string, config: any = {}) => {
		if (typeof window === 'undefined') throw new Error('Cannot fetch on server side');
		const res = await (this.me?.httpClient || window.fetch)(`${lichessHost}${path}`, config);
		if (res.error || !res.ok) {
			const err = `${res.error} ${res.status} ${res.statusText}`;
			alert(err);
			throw err;
		}
		return res;
	};
}
