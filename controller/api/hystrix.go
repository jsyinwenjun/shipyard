package api

import (
	"net/http"
	"net/url"
)

func (a *Api) hystrixRedirect(w http.ResponseWriter, req *http.Request) {
	var err error
	
	req.URL, err = url.ParseRequestURI(a.hUrl)
	req.URL.Add("origin", fmt.Sprintf("%s/%s", a.sopcloudAddr, "hystrix.stream"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	a.fwd.ServeHTTP(w, req)
}