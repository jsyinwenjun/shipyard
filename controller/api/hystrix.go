package api

import (
	"net/http"
	"net/url"
	"fmt"
)

func (a *Api) hystrixRedirect(w http.ResponseWriter, req *http.Request) {
	var err error
	
	req.URL, err = url.ParseRequestURI(a.hUrl)
	req.PostForm = url.Values{"origin": {fmt.Sprintf("%s/hystrix.stream", a.sopcloudAddr)}}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	a.fwd.ServeHTTP(w, req)
}