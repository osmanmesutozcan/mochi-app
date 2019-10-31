/* tslint:disable */

(chrome as any).app.runtime.onLaunched.addListener(function() {
  (chrome as any).app.window.create('page.html', { id: 'Mochi' }, function() {});
});
