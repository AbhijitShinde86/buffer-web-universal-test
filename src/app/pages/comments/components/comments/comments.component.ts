import { Component, Input, OnInit } from '@angular/core';

import { User } from 'src/app/auth/user.model';
import { ActiveCommentInterface } from '../../types/activeComment.interface';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent implements OnInit {
  @Input() comments!:[];
  @Input() currentStartupId!: string;
  @Input() currentUser!: User;
  @Input() isVendor!: Boolean;
  @Input() startupUserId!:string;

  activeComment: ActiveCommentInterface | null = null;

  constructor() {}

  ngOnInit(): void {
  }

  setActiveComment(activeComment: ActiveCommentInterface | null): void {
    // console.log("setActiveComment : ",activeComment);
    this.activeComment = activeComment;
  }  
}
