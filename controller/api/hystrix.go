package api

import (
	"net/http"
	"net/url"
	"fmt"
)

func (a *Api) hystrixRedirect(w http.ResponseWriter, req *http.Request) {
	var err error
	
	req.URL, err = url.ParseRequestURI(a.hUrl)
	c := url.Values{"origin": {fmt.Sprintf("%s/hystrix.stream", a.sopcloudAddr)}}
	log.Errorf(c.Encode())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	a.fwd.ServeHTTP(w, req)
}