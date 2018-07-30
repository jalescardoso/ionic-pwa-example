import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window;
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	constructor(
		private _sanitizer: DomSanitizer,
		public navCtrl: NavController) {

		new Promise<any>(resolve => window.addEventListener("beforeinstallprompt", resolve))
			.then(ev => {
				console.log('beforeinstallprompt out');
				ev.preventDefault();
				this.prompt = ev;
			})
	}
	prompt;
	position;
	photoBlob;
	camAvb = false;
	@ViewChild('videoId') video: ElementRef;

	cameraAvaiable() {
		 return true;
	}
	
	async ngOnInit() {
		this.getLoc();
		this.camAvb = await new Promise<boolean>(resolve => {
			navigator.mediaDevices.getUserMedia({ video: true })
				.then(mStream => { mStream.stop(); resolve(true); })
				.catch(error => resolve(false));
		});
	}

	addHome() {
		if (!this.prompt) return;
		this.prompt.prompt();
	}

	getLoc() {
		new Promise<any>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
			.then(pos => { console.log(pos); this.position = `lat : ${pos.coords.latitude}, lng : ${pos.coords.longitude}`; })
			.catch(err => console.error(err));
	}

	teste(e) {
		var file = e.target.files[0];
		this.photoBlob = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
	}
}