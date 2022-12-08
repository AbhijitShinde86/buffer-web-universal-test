import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import 'quill-emoji/dist/quill-emoji.js';

import { QuillConfig } from '../../../../utilities/quill-config'
import { User } from 'src/app/auth/user.model';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'question-form',
  templateUrl: './questionForm.component.html',
  styles:[]
})

export class QuestionFormComponent implements OnInit {
  @Input() submitLabel!: string;
  @Input() hasCancelButton: boolean = false;
  @Input() initialText: string = '';
  @Input() currentUser!: User;
  
  @Output()
  handleSubmit = new EventEmitter<string>();

  @Output()
  handleCancel = new EventEmitter<void>();

  form!: FormGroup; quillConfig;
  isBrowser;

  constructor(private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId) {
    this.quillConfig = QuillConfig.getCommentQuillConfig();
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.initialText, Validators.required],
    });
  }

  onSubmit(): void {
    this.handleSubmit.emit(this.form.value.title);
    this.form.reset();
  }
}
